import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
    beforeEach(() => {
        localStorage.clear();
        render(<App />);
    });

    it('Adicionar uma nova tarefa', async () => {
        fireEvent.change(screen.getByPlaceholderText('Nova tarefa'), { target: { value: 'Tarefa de Teste' } });
        fireEvent.click(screen.getByText('Criar Tarefa'));

        const tarefas = await screen.findAllByText('Tarefa de Teste');
        expect(tarefas.length).toBeGreaterThan(0);
        expect(tarefas[0]).toBeInTheDocument();
    });

    it('Marcar uma tarefa como concluída', async () => {
        fireEvent.change(screen.getByPlaceholderText('Nova tarefa'), { target: { value: 'Tarefa de Teste' } });
        fireEvent.click(screen.getByText('Criar Tarefa'));

        const tarefas = await screen.findAllByText('Tarefa de Teste');
        expect(tarefas.length).toBeGreaterThan(0);
        expect(tarefas[0]).toBeInTheDocument();

        fireEvent.click(screen.getAllByText('Ver')[0]);

        fireEvent.click(screen.getByRole('button', { name: /Marcar como Concluída/i }));

        await waitFor(() => {
            const tarefaConcluida = screen.getAllByText('Tarefa de Teste');
            expect(tarefaConcluida[0].closest('.todo')).toHaveClass('completed');
        });
    });

    it('Remover uma tarefa', async () => {
        fireEvent.change(screen.getByPlaceholderText('Nova tarefa'), { target: { value: 'Tarefa de Teste' } });
        fireEvent.click(screen.getByText('Criar Tarefa'));

        const tarefas = await screen.findAllByText('Tarefa de Teste');
        expect(tarefas.length).toBeGreaterThan(0);
        expect(tarefas[0]).toBeInTheDocument();

        fireEvent.click(screen.getAllByText('Ver')[0]);
        fireEvent.click(screen.getByRole('button', { name: /Remover/i }));

        await waitFor(() => {
            const tarefasRemovidas = screen.queryAllByText('Tarefa de Teste');
            console.log('Tarefas removidas:', tarefasRemovidas.length);
            tarefasRemovidas.forEach((tarefa, index) => {
                console.log(`Tarefa ${index + 1}:`, tarefa.textContent, tarefa.className);
            });
            expect(tarefasRemovidas.length).toBe(0);
        });
    });
});